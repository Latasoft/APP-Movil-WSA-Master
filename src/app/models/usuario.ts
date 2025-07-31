export interface Usuario{
    _id?:string
    username:string;
    password:string;
    email:string;
    tipo_usuario:string;
    puede_crear_nave?: boolean;
    pais_cliente?: string;
    nombre_cliente?: string;
    dato_contacto_cliente?: string;
    empresa_cliente?: string;
}
export interface PaginatedUsersResponse {
    message: string;
    users: Usuario[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }

  export interface UserByIdResponse {
    message: string;
    userResponse: Usuario;
  }
  