from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from serializers import *
# Create your views here.

class RegistrationView(APIView):
    """View for handling user registration"""
    def post(self,request,format=None):
        user = RegistrationSerializer(data=request.data)
        if user.is_valid():
            user.save()
            return Response(user.validated_data,status=status.HTTP_201_CREATED)
        return Response(user.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """View for handling login with Token authentication. Also checks account has been email-verified."""
    def post(self,request,format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class ConfirmEmailView(APIView):
    """View which allows the user to confirm their email"""
    def post(self,request,format=None):
        serializer = EmailActivationConfirmSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """View which allows user to request a password reset email"""
    def post(self,request,format=None):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # Creates and sends the password reset
            return Response(serializer.validated_data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class PasswordResetConfirmView(APIView):
    """View which allows user to confirm their password reset, so the password can be changed"""
    def post(self,request,format=None):
        try:
            user = User.objects.get(username=request.data['username'])
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = PasswordResetConfirmSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    """View for updating the users profile. If their email is changed it must be confirmed"""
    permission_classes = (permissions.IsAuthenticated,)
    def put(self,request,format='json'):
        serializer = UserModelSerializer(request.user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data,status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)