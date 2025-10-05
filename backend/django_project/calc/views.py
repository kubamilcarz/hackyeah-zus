import json
import sys
from pathlib import Path

from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt

# Ensure we can import calc.py from the repository root (backend directory)
BACKEND_ROOT = Path(__file__).resolve().parents[2]  # /home/.../backend
if str(BACKEND_ROOT) not in sys.path:
    sys.path.append(str(BACKEND_ROOT))

try:
    import calc2 as calc # from backend/calc.py
except Exception as e:
    calc = None
    _import_error = str(e)
else:
    _import_error = None


@csrf_exempt
def index(request: HttpRequest):
    age = request.GET.get('age')
    sex = request.GET.get('sex')

    return JsonResponse({'message': 'Hello, world!'})

@csrf_exempt
def pension(request: HttpRequest):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    if calc is None:
        return JsonResponse({'error': 'Calculator module not available', 'detail': _import_error}, status=500)

    try:
        payload = json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    result = calc.calculate_pension_api(payload)

    status_code = 200 if 'error' not in result else 400
    return JsonResponse(result, status=status_code, json_dumps_params={'ensure_ascii': False})


def fact(_request: HttpRequest):
    if calc is None:
        return JsonResponse({'error': 'Calculator module not available', 'detail': _import_error}, status=500)

    try:
        return JsonResponse({'fact': calc.get_random_fact()})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
