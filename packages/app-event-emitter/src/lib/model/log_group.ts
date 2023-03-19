export type LogGroup = ApiRequestLogGroup|UsersLogGroup|ProductsLogGroup;

export enum ApiRequestLogGroup{
    USERS_API_REQUEST="api.request",
    PRODUCTS_API_REQUEST="api.products.request",
}

export enum UsersLogGroup{
    RESET_PASSWORD="user.passwordReset",
    CHANGE_PASSWORD="user.changePassword",
    CHANGE_EMAIL="user.changeEmail",
    CLOSE_ACCOUNT="user.closeAccount",
    PROFILE_UPDATE="user.updateProfile",
    USER_LOGIN="user.login",
    USER_LOGOUT="user.logout",
}

export enum ProductsLogGroup{
    PRODUCT_CREATED="product.created",
    PRODUCT_UPDATED="product.updated",
    PRODUCT_DELETED="product.deleted",
    PRODUCT_VARIANT_CREATED="product.variant.created",
    PRODUCT_VARIANT_UPDATED="product.variant.updated",
}