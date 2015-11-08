from rest_framework.pagination import PageNumberPagination

class ClientControllablePagination(PageNumberPagination):
    """Defines default pagination settings. May be overriden by frontend"""
    page_size = 100
    max_page_size = 200
    page_size_query_param = 'page_size'

