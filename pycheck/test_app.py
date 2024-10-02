# test_app.py

import pytest
from app import app

@pytest.fixture
def client():
    """A test client for the app."""
    with app.test_client() as client:
        yield client

def test_hello(client):
    """Test the hello endpoint."""
    response = client.get('/api/hello')
    assert response.status_code == 200
    assert response.get_json() == {"message": "Hello, World!"}

def test_add(client):
    """Test the add endpoint."""
    response = client.post('/api/add', json={'a': 5, 'b': 3})
    assert response.status_code == 200
    assert response.get_json() == {"result": 8}

    # Test with missing values
    response = client.post('/api/add', json={'a': 5})
    assert response.status_code == 200
    assert response.get_json() == {"result": 5}

    # Test with no input
    response = client.post('/api/add', json={})
    assert response.status_code == 200
    assert response.get_json() == {"result": 0}
