
import pandas as pd
import numpy as np
import json, math, os, argparse, sys
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple

PARAM_XLSX = "/mnt/data/Parametry-III 2025.xlsx"
NOW_YEAR = 2025  # anchor for CPI deflation in this bundle

# -------------------------
# Data structures
# -------------------------

@dataclass
class AnnualParams:
    year: int
    cpi: float
    real_wage_growth: float
    avg_wage: float
    emp_rate_employee: float
    emp_rate_employer: float
    ofe_rate: float
    subaccount_rate: float
    index_konto: float
    index_sub: float
    monthly_base_cap_multiplier: float
    min_pension_march_feb: float

@dataclass
class ParamStore:
    annual: Dict[int, AnnualParams] = field(default_factory=dict)
    e60_table: Optional[pd.DataFrame] = None
    ex_table: Optional[pd.DataFrame] = None

# -------------------------
# Parameter loading
# -------------------------


def load_parameters(xlsx_path: str = PARAM_XLSX) -> ParamStore:
    store = ParamStore()
    if not os.path.exists(xlsx_path):
        return store
    xls = pd.ExcelFile(xlsx_path)
    # Robust header detection for "parametry roczne"
    raw = pd.read_excel(xls, "parametry roczne", header=None)
    # locate header row where first cell equals 'rok'
    header_row_idx = raw.index[raw.iloc[:,0].astype(str).str.strip().str.lower()=="rok"].tolist()
    if not header_row_idx:
        # fallback to header=1
        df = pd.read_excel(xls, "parametry roczne", header=1)
    else:
        h = header_row_idx[0]
        df = pd.read_excel(xls, "parametry roczne", header=h)
    # Rename columns
    rename_map = {
        'rok': 'year',
        'średnioroczny wskaźnik cen towarów i usług konsumpcyjnych ogółem*)': 'cpi',
        'wskaźnik realnego wzrostu przeciętnego wynagrodzenia*)': 'real_wage_growth',
        'przeciętne miesięczne wynagrodzenie w gospodarce narodowej**)': 'avg_wage',
        'stopa składki na ubezpieczenie emerytalne finansowanej przez pracownika': 'emp_rate_employee',
        'stopa składki na ubezpieczenie emerytalne finansowanej przez pracodawcę': 'emp_rate_employer',
        'stopa składki na ubezpieczenie emerytalne odprowadzana do OFE': 'ofe_rate',
        'stopa składki na ubezpieczenie emerytalne odprowadzana na subkonto ': 'subaccount_rate',
        'łączna stopa składki odprowadzanej do OFE i składki ewidencjonowanej na subkoncie': 'total_ofe_sub',
        'wskaźnik waloryzacji składek zewidencjonowanych na koncie oraz kapitału początkowego za dany rok***)': 'index_konto',
        'wskaźnik waloryzacji składek zewidencjonowanych na subkoncie za dany rok****)': 'index_sub',
    }
    # Try to find the long cap & min pension columns by partial match
    for c in df.columns.tolist():
        s = str(c)
        if "ograniczenie górne" in s:
            rename_map[c] = 'base_cap_mult'
        if "kwota najniższej emerytury" in s:
            rename_map[c] = 'min_pension'
    df = df.rename(columns=rename_map)
    # Keep only relevant columns
    need = ['year','cpi','real_wage_growth','avg_wage','emp_rate_employee','emp_rate_employer','ofe_rate','subaccount_rate','index_konto','index_sub','base_cap_mult','min_pension']
    for col in need:
        if col not in df.columns:
            df[col] = np.nan
    # Drop non-numeric year rows
    def _is_intlike(x):
        try:
            int(x); return True
        except:
            return False
    df = df[df['year'].apply(_is_intlike)]
    df['year'] = df['year'].astype(int)
    for col in ['cpi','real_wage_growth','avg_wage','emp_rate_employee','emp_rate_employer','ofe_rate','subaccount_rate','index_konto','index_sub','base_cap_mult','min_pension']:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    for _, r in df.iterrows():
        y = int(r['year'])
        store.annual[y] = AnnualParams(
            year=y,
            cpi=float(r.get('cpi', 1.0) or 1.0),
            real_wage_growth=float(r.get('real_wage_growth', 1.0) or 1.0),
            avg_wage=float(r.get('avg_wage', float('nan'))),
            emp_rate_employee=float(r.get('emp_rate_employee', 0.0976) or 0.0976),
            emp_rate_employer=float(r.get('emp_rate_employer', 0.0976) or 0.0976),
            ofe_rate=float(r.get('ofe_rate', 0.0) or 0.0),
            subaccount_rate=float(r.get('subaccount_rate', 0.0) or 0.0),
            index_konto=float(r.get('index_konto', 1.0) or 1.0),
            index_sub=float(r.get('index_sub', 1.0) or 1.0),
            monthly_base_cap_multiplier=float(r.get('base_cap_mult', 2.5) or 2.5),
            min_pension_march_feb=float(r.get('min_pension', float('nan')))
        )
    try:
        store.e60_table = pd.read_excel(xls, "e_60 M i K-GUS", header=None)
    except Exception:
        store.e60_table = None
    try:
        store.ex_table = pd.read_excel(xls, "e_x  M i K-GUS", header=None)
    except Exception:
        store.ex_table = None
    return store
    xls = pd.ExcelFile(xlsx_path)
    df = pd.read_excel(xls, "parametry roczne", header=1)
    df = df.rename(columns={
        'rok': 'year',
        'średnioroczny wskaźnik cen towarów i usług konsumpcyjnych ogółem*)': 'cpi',
        'wskaźnik realnego wzrostu przeciętnego wynagrodzenia*)': 'real_wage_growth',
        'przeciętne miesięczne wynagrodzenie w gospodarce narodowej**)': 'avg_wage',
        'stopa składki na ubezpieczenie emerytalne finansowanej przez pracownika': 'emp_rate_employee',
        'stopa składki na ubezpieczenie emerytalne finansowanej przez pracodawcę': 'emp_rate_employer',
        'stopa składki na ubezpieczenie emerytalne odprowadzana do OFE': 'ofe_rate',
        'stopa składki na ubezpieczenie emerytalne odprowadzana na subkonto ': 'subaccount_rate',
        'wskaźnik waloryzacji składek zewidencjonowanych na koncie oraz kapitału początkowego za dany rok***)': 'index_konto',
        'wskaźnik waloryzacji składek zewidencjonowanych na subkoncie za dany rok****)': 'index_sub',
        'ograniczenie górne miesięcznej podstawy wymiaru składek na ub...przeciętnego miesięcznego wynagrodzenia w gospodarce narodowej': 'base_cap_mult',
        'kwota najniższej emerytury obowiązująca od marca danego roku do lutego następnego roku*****)': 'min_pension'
    })
    for col in ['cpi','real_wage_growth','avg_wage','emp_rate_employee','emp_rate_employer','ofe_rate','subaccount_rate','index_konto','index_sub','base_cap_mult','min_pension']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    df = df[pd.notnull(df['year'])]
    for _, r in df.iterrows():
        y = int(r['year'])
        store.annual[y] = AnnualParams(
            year=y,
            cpi=float(r.get('cpi', 1.0) or 1.0),
            real_wage_growth=float(r.get('real_wage_growth', 1.0) or 1.0),
            avg_wage=float(r.get('avg_wage', float('nan'))),
            emp_rate_employee=float(r.get('emp_rate_employee', 0.0976) or 0.0976),
            emp_rate_employer=float(r.get('emp_rate_employer', 0.0976) or 0.0976),
            ofe_rate=float(r.get('ofe_rate', 0.0) or 0.0),
            subaccount_rate=float(r.get('subaccount_rate', 0.0) or 0.0),
            index_konto=float(r.get('index_konto', 1.0) or 1.0),
            index_sub=float(r.get('index_sub', 1.0) or 1.0),
            monthly_base_cap_multiplier=float(r.get('base_cap_mult', 2.5) or 2.5),
            min_pension_march_feb=float(r.get('min_pension', float('nan')))
        )
    try:
        store.e60_table = pd.read_excel(xls, "e_60 M i K-GUS", header=None)
    except Exception:
        store.e60_table = None
    try:
        store.ex_table = pd.read_excel(xls, "e_x  M i K-GUS", header=None)
    except Exception:
        store.ex_table = None
    return store

PARAMS = load_parameters()

# -------------------------
# Utility functions
# -------------------------

def nominal_wage_projection(start_year: int, end_year: int, base_gross_monthly: float, params: ParamStore) -> Dict[int, float]:
    wages = {}
    w = float(base_gross_monthly)
    for y in range(start_year, end_year):
        wages[y] = w
        ap = params.annual.get(y) or params.annual.get(max([k for k in params.annual.keys() if k<=y], default=NOW_YEAR), None)
        if ap is not None:
            g = float(ap.cpi or 1.0) * float(ap.real_wage_growth or 1.0)
        else:
            g = 1.03
        w = w * g
    return wages

def apply_overrides(wages: Dict[int,float], overrides: Optional[List[Dict]]) -> Dict[int,float]:
    out = dict(wages)
    for item in overrides or []:
        y = int(item['year']); out[y] = float(item['gross_monthly_pln'])
    return out

def apply_sick_leave(base_annual: float, months_on_leave: int) -> float:
    m = max(0, min(12, int(months_on_leave or 0)))
    eff_months = (12 - m) + 0.8*m
    return base_annual * (eff_months/12.0)

def base_cap_for_year(y: int, params: ParamStore) -> Optional[float]:
    ap = params.annual.get(y)
    if not ap or math.isnan(ap.avg_wage):
        return None
    return 12.0 * ap.monthly_base_cap_multiplier * ap.avg_wage

def contribution_split_rates(y: int, params: ParamStore) -> Tuple[float,float,float]:
    ap = params.annual.get(y)
    if not ap:
        return 0.1952, 0.0, 0.0
    total = (ap.emp_rate_employee or 0.0) + (ap.emp_rate_employer or 0.0)
    sub = (ap.subaccount_rate or 0.0)
    ofe = (ap.ofe_rate or 0.0)
    konto = max(0.0, total - sub - ofe)
    return konto, sub, ofe

def index_factors(y: int, params: ParamStore) -> Tuple[float,float]:
    ap = params.annual.get(y)
    if not ap:
        return 1.0, 1.0
    return float(ap.index_konto or 1.0), float(ap.index_sub or 1.0)

def life_expectancy_months(sex: str, retirement_age: int, retirement_year: int, params: ParamStore) -> float:
    sex = (sex or "").lower()
    if retirement_age in (60,65):
        if sex == 'male' and retirement_age==65:
            return 206.0
        if sex == 'female' and retirement_age==60:
            return 247.0
    return 216.0

def legal_retirement_age(sex: str) -> int:
    return 60 if (sex or "").lower()=="female" else 65

# -------------------------
# Core compute
# -------------------------

def compute(payload: Dict, params: ParamStore = PARAMS) -> Dict:
    basic = payload.get("basic", {})
    sex = basic.get("sex")
    age = int(basic.get("age"))
    monthly = float(basic.get("gross_salary_monthly_pln"))
    work_start_year = int(basic.get("work_start_year"))
    retire_year = int(basic.get("planned_retirement_year"))
    start_year = work_start_year
    end_year = retire_year

    wages = nominal_wage_projection(start_year, end_year, monthly, params)
    overrides = (payload.get("earnings_paths", {}) or {}).get("future_salary_overrides", [])
    wages = apply_overrides(wages, overrides)
    hist = (payload.get("earnings_paths", {}) or {}).get("historical_salaries", [])
    wages = apply_overrides(wages, hist)

    sick_periods = {(p['year']): int(p.get('months_on_leave',0)) for p in (payload.get('sick_leave',{}) or {}).get('sick_leave_periods',[])}

    konto = float(payload.get("balances",{}).get("zus_account_balance_pln") or 0.0)
    sub = float(payload.get("balances",{}).get("zus_subaccount_balance_pln") or 0.0)
    history_detail = []
    for y in sorted(wages.keys()):
        gross_annual = 12.0 * float(wages[y])
        months_on_leave = sick_periods.get(y, 0)
        effective_annual = apply_sick_leave(gross_annual, months_on_leave) if months_on_leave else gross_annual
        cap = base_cap_for_year(y, params)
        base_for_contrib = min(effective_annual, cap) if cap is not None else effective_annual
        r_konto, r_sub, r_ofe = contribution_split_rates(y, params)
        contrib_konto = base_for_contrib * r_konto
        contrib_sub = base_for_contrib * r_sub
        ik, isub = index_factors(y, params)
        konto = konto * ik + contrib_konto
        sub = sub * isub + contrib_sub
        history_detail.append({
            "year": y,
            "gross_monthly": wages[y],
            "gross_annual": gross_annual,
            "months_on_leave": months_on_leave,
            "effective_annual_base": effective_annual,
            "base_cap": cap,
            "base_for_contrib": base_for_contrib,
            "rate_konto": r_konto, "rate_sub": r_sub, "rate_ofe": r_ofe,
            "contrib_konto": contrib_konto, "contrib_sub": contrib_sub,
            "index_konto": ik, "index_sub": isub,
            "saldo_konto_after": konto, "saldo_sub_after": sub
        })
    capital_total = konto + sub
    legal_age = legal_retirement_age(sex)
    retirement_age = legal_age
    L = life_expectancy_months(sex, retirement_age, retire_year, params)
    monthly_pension_nominal = capital_total / max(1.0, L)

    cpi_chain = 1.0
    for y in range(NOW_YEAR, retire_year):
        ap = params.annual.get(y)
        cpi_chain *= float(ap.cpi or 1.0) if ap else 1.02
    monthly_pension_real_today = monthly_pension_nominal / cpi_chain

    min_pension = None
    ap_r = params.annual.get(retire_year)
    if ap_r and not math.isnan(ap_r.min_pension_march_feb):
        min_pension = float(ap_r.min_pension_march_feb)

    return {
        "inputs": payload,
        "summary": {
            "capital_account": round(konto,2),
            "capital_subaccount": round(sub,2),
            "capital_total": round(capital_total,2),
            "life_expectancy_months": round(L,1),
            "monthly_pension_nominal": round(monthly_pension_nominal,2),
            "monthly_pension_real_today": round(monthly_pension_real_today,2),
            "min_pension_reference": min_pension
        },
        "detail": history_detail
    }

# -------------------------
# CLI
# -------------------------

EXAMPLE_PAYLOAD = {
  "version": "1.0",
  "basic": {
    "age": 27,
    "sex": "male",
    "gross_salary_monthly_pln": 8200.00,
    "work_start_year": 2021,
    "planned_retirement_year": 2065
  },
  "expectations": {"expected_pension_today_pln": 5000.0},
  "balances": {"zus_account_balance_pln": 0.0, "zus_subaccount_balance_pln": 0.0},
  "sick_leave": {"include_sick_leave_effects": True, "sick_leave_periods": [{"year": 2027, "months_on_leave": 2}]},
  "earnings_paths": {"historical_salaries": [], "future_salary_overrides": [{"year": 2026, "gross_monthly_pln": 9000.0}]},
  "meta": {"postal_code": "00-001", "consent_usage_stats": True}
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--example", action="store_true", help="Run example payload")
    parser.add_argument("--input", type=str, help="Path to JSON payload file")
    parser.add_argument("--output", type=str, help="Path to write JSON result")
    args = parser.parse_args()
    if args.example:
        payload = EXAMPLE_PAYLOAD
    elif args.input:
        with open(args.input, "r", encoding="utf-8") as f:
            payload = json.load(f)
    else:
        print("Provide --example or --input <file.json>", file=sys.stderr)
        sys.exit(1)
    params = load_parameters(PARAM_XLSX)
    result = compute(payload, params)
    out = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(out)
    else:
        print(out)

if __name__ == "__main__":
    main()
