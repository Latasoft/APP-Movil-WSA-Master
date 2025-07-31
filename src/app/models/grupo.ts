export interface Grupo{
    _id?:string;
    name:string;
    status:boolean;
    members:string[];
}


export interface GrupoMiembro {
    _id: string;
    username: string;
  }
  
  export interface GrupoAdmin {
    _id: string;
    name: string;
    status?: boolean; // Puede venir o no (como en tu primer objeto)
    members: GrupoMiembro[];
  }
  
  export interface GetGroupsForAdminResponse {
    data: GrupoAdmin[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }

  export interface GrupoBasico {
    _id: string;
    name: string;
    status: boolean;
  }
  
  export interface GetUserGroupsResponse {
    data: GrupoBasico[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }
  
  