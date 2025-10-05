import pandas as pd
from pathlib import Path


def _read_polish_csv(file_path: str):
    """Read a CSV with typical Polish formatting (decimal comma, optional NBSP thousands).
    Tries multiple encodings and parses numbers when possible without producing NaNs from parsing.
    Returns a pandas DataFrame or raises the last exception.
    """
    encodings = ["utf-8-sig", "utf-8", "cp1250"]
    last_err = None
    for enc in encodings:
        try:
            # Pre-clean NBSP (\xa0) which often appears as thousands separator in Polish CSVs
            text = Path(file_path).read_text(encoding=enc)
            text = text.replace("\xa0", " ")  # normalize NBSP to space
            # Use pandas to read from string buffer with proper decimal
            from io import StringIO
            buf = StringIO(text)
            # Use engine='python' to allow sep=None autodetection while respecting quotes
            df = pd.read_csv(buf, sep=None, engine='python', decimal=',')
            return df
        except Exception as e:
            last_err = e
            continue
    if last_err:
        raise last_err


def read_csv_data(file_paths=("dane.csv", "zwolnienia.csv")):
    """
    Read data from multiple CSV files and return a dict of DataFrames keyed by file stem.
    Note: Previously this function concatenated heterogeneous CSVs which produced NaNs.
    We now keep datasets separate to preserve their schemas and avoid NaNs.
    Args:
        file_paths (list|tuple): List of paths to the CSV files
    Returns:
        dict[str, pd.DataFrame]: Mapping from file stem to DataFrame
    """
    try:
        result = {}
        for file_path in file_paths:
            path = Path(file_path)
            df = _read_polish_csv(str(path))
            result[path.stem] = df
        return result
    except FileNotFoundError as e:
        print(f"Error: File not found - {str(e)}")
        return None
    except Exception as e:
        print(f"Error reading CSV files: {str(e)}")
        return None


def create_column_dictionaries(data):
    """
    Create dictionaries from DataFrame columns using first column as keys.
    If a dict of DataFrames is provided, the result will be nested by file key.
    Args:
        data (pd.DataFrame|dict[str,pd.DataFrame]): Input data
    Returns:
        dict: Dictionary of column dictionaries
    """
    if data is None:
        return None

    def df_to_dict(df: pd.DataFrame):
        if df is None or df.empty:
            return None
        res = {}
        key_column = df.columns[0]
        for column in df.columns[1:]:
            res[column] = dict(zip(df[key_column], df[column]))
        return res

    if isinstance(data, dict):
        out = {}
        for name, df in data.items():
            conv = df_to_dict(df)
            if conv:
                out[name] = conv
        return out if out else None
    else:
        return df_to_dict(data)


datasets = read_csv_data(["dane.csv", "zwolnienia.csv"])
if datasets is not None:
    print("Successfully read CSV datasets (kept separate to avoid NaNs):")
    for name, df in datasets.items():
        print(f"\n== {name} ==")
        print(df.head())

    column_dicts = create_column_dictionaries(datasets)
    if column_dicts:
        for dataset_name, cols in column_dicts.items():
            for column_name, column_dict in cols.items():
                if column_name.startswith('inflacja'):
                    inflation_rate = column_dict
                elif column_name.startswith('wskaźnik waloryzacji składek zewidencjonowanych na koncie'):
                    indexation_rate = column_dict
                elif column_name.startswith('wskaźnik waloryzacji składek zewidencjonowanych na subkoncie'):
                    indexation_rate_sub = column_dict
                elif column_name.startswith('średnia'):
                    average_life = column_dict
                elif column_name.startswith('kobiety'):
                    female_l4 = column_dict
                elif column_name.startswith('faceci'):
                    male_l4 = column_dict

    for key in indexation_rate:
        indexation_rate[key] = float(indexation_rate[key].replace("%", "").replace(",", ".")) / 100.0
    for key in indexation_rate_sub:
        indexation_rate_sub[key] = float(indexation_rate_sub[key].replace("%", "").replace(",", ".")) / 100.0
    # print(inflation_rate)
    # print(indexation_rate)
    # print(indexation_rate_sub)
    # print(average_life)
    # print(female_l4)
    # print(male_l4)


def calculate_basic_retirement_sum(age: int, is_male: bool, salary_yearly: float, work_start_year: int, retirement_year: int = 0):
    retirement_rate = 0.1952
    if retirement_year == 0:
        retirement_age = 65 if is_male else 60
        retirement_year = 2025 + retirement_age - age

    result = 0
    for year in range(work_start_year, retirement_year):
        result += salary_yearly * retirement_rate
        result *= indexation_rate.get(year + 1)

    return result


def calculate_expected_dead(age: int):
    return average_life.get(2025 - age + 60) // 12 + 60


def calculate_expected_wyplata_emerytury(age: int, is_male: bool, salary_yearly: float, work_start_year: int, retirement_year: int = 0):
    if retirement_year == 0:
        retirement_age = 65 if is_male else 60
        retirement_year = 2025 + retirement_age - age

    return calculate_basic_retirement_sum(age, is_male, salary_yearly, work_start_year, retirement_year) / (calculate_expected_dead(age) - retirement_year) / 12
