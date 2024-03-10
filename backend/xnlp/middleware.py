from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt
from django.conf import settings
from bson import ObjectId

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization') or request.COOKIES.get('jwt')
        if not token:
            return None

        try:
            decoded_token = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
            idDecoded = decoded_token['id']
            user_id = ObjectId(idDecoded)
            user = User.objects.get(_id=user_id)
            return (user, None)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')