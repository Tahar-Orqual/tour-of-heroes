import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HttpAccessService<Entity, CreateDTO, PatchDTO, DeleteResult> {
  protected apiUrl = "";
  protected readonly httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  protected readonly http = inject(HttpClient);

  findAll$(): Observable<Entity[]> {
    return this.http.get<Entity[]>(this.apiUrl, this.httpOptions);
  }

  findOne$(id: number): Observable<Entity> {
    return this.http.get<Entity>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  createOne$(createDTO: CreateDTO): Observable<Entity> {
    return this.http.post<Entity>(this.apiUrl, createDTO, this.httpOptions);
  }

  updateOne$(id: number, entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(
      `${this.apiUrl}/${id}`,
      entity,
      this.httpOptions
    );
  }

  patchOne$(id: number, patchDTO: PatchDTO): Observable<Entity> {
    return this.http.patch<Entity>(
      `${this.apiUrl}/${id}`,
      patchDTO,
      this.httpOptions
    );
  }

  deleteOne$(id: number): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(
      `${this.apiUrl}/${id}`,
      this.httpOptions
    );
  }
}
