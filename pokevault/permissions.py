from rest_framework import permissions

class IsGerente(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'GERENTE'

class IsEstoquista(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ESTOQUISTA'