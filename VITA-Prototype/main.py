import json
from app import app  # noqa: F401
from routes import *  # noqa: F401

# Add custom Jinja filters
@app.template_filter('fromjson')
def fromjson_filter(value):
    try:
        return json.loads(value)
    except:
        return {}

@app.template_filter('tojson')
def tojson_filter(value):
    try:
        return json.dumps(value)
    except:
        return '{}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
