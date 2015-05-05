from rest_framework.pagination import PageNumberPagination

class ClientControllablePagination(PageNumberPagination):
    page_size = 100 #default
    max_page_size = 200
    page_size_query_param = 'page_size'

