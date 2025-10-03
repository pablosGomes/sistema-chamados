from flask import Flask
from flask_cors import CORS
from config import init_app
from routes.chamados import chamados_bp
from routes.changes import changes_bp


def create_app():
    app = Flask(__name__)
    init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(chamados_bp, url_prefix="/api")
    app.register_blueprint(changes_bp, url_prefix="/api")

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)