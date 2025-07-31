import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetGroupsForAdminResponse, GetUserGroupsResponse, Grupo, GrupoBasico } from '../models/grupo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private apiUrl=`${environment.apiUrl}/grupos`;
  constructor(private http:HttpClient) { }

  crearGrupo(grupo:Grupo):Observable<Grupo>{
    return this.http.post<Grupo>(`${this.apiUrl}`,grupo)
  }

  updateGrupo(_id:string,grupo:Grupo):Observable<Grupo>{
    return this.http.put<Grupo>(`${this.apiUrl}/${_id}`,grupo)
  }
   

  getAllGroupsForAdmin(page = 1, limit = 10):Observable<GetGroupsForAdminResponse>{
    return this.http.get<GetGroupsForAdminResponse>(`${this.apiUrl}/?page=${page}&limit=${limit}`)
  }

  getAllGroupsForEmployee(_id:string,page = 1, limit = 10):Observable<GetUserGroupsResponse>{
    return this.http.get<GetUserGroupsResponse>(`${this.apiUrl}/user/${_id}/?page=${page}&limit=${limit}`)
  }

  getGroupById(_id:string):Observable<{data:Grupo}>{
    return this.http.get<{data:Grupo}>(`${this.apiUrl}/${_id}`)
  }

  

}