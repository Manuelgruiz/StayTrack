from locust import HttpUser, task, between

class StayTrackUser(HttpUser):
    # Sin espera para prueba de estrés rápida
    wait_time = between(0.1, 0.5)

    @task(1)
    def health_check(self):
        self.client.get("/health")

    @task(3)
    def load_docs(self):
        self.client.get("/docs")

    @task(2)
    def load_openapi_json(self):
        self.client.get("/openapi.json")
