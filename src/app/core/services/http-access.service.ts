import { HttpParams } from "@angular/common/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HttpAccessService<Entity, CreateDTO, PatchDTO, DeleteResult> {
  protected apiUrl = "";
  protected readonly httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  protected readonly http = inject(HttpClient);

  /**
   * Send a GET /{apiUrl} http request to retrieve all entities
   * @returns an observable of a list of all entities
   */
  findAll$(): Observable<Entity[]> {
    return this.http.get<Entity[]>(this.apiUrl, this.httpOptions);
  }

  /**
   * Send a GET /{apiUrl}?{params.key}={params.value} http request to retrieve a list of entities
   * @returns an observable of a list of all entities
   */
  findMany$(
    params: Record<string, string | number | boolean>
  ): Observable<Entity[]> {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return this.http
      .get<Entity[]>(`${this.apiUrl}?${query}`, this.httpOptions)
      .pipe(tap((r) => console.log(r)));
  }

  /**
   * Send a GET /{apiUrl}/{id} http request to retrieve one entity by its id
   * @param id primary key, could be of type number or string
   * @returns an observable of one entity
   */
  findOne$(id: number | string): Observable<Entity> {
    return this.http.get<Entity>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  /**
   * Send a POST /{apiUrl} http request to post one entity from a create dto object
   * @param createDTO the data that will be used to create an entity
   * @returns an observable of the registered entity
   */
  createOne$(createDTO: CreateDTO): Observable<Entity> {
    return this.http.post<Entity>(this.apiUrl, createDTO, this.httpOptions);
  }

  /**
   * Send a PUT /{apiUrl}/{id} http request to update by replacing an entity
   * @param id primary key, could be of type number or string
   * @param entity the entity that will replace the old one
   * @returns an observable of the updated entity
   */
  updateOne$(id: number | string, entity: Entity): Observable<Entity> {
    return this.http.put<Entity>(
      `${this.apiUrl}/${id}`,
      entity,
      this.httpOptions
    );
  }

  /**
   * Send a Patch /{apiUrl}/{id} http request to update a part of an entity
   * @param id primary key, could be of type number or string
   * @param patchDto the data that will be used to update the entity
   * @returns an observable of the patched entity
   */
  patchOne$(id: number | string, patchDTO: PatchDTO): Observable<Entity> {
    return this.http.patch<Entity>(
      `${this.apiUrl}/${id}`,
      patchDTO,
      this.httpOptions
    );
  }

  /**
   * Send a Delete /{apiUrl}/{id} http request to delete an entity
   * @param id primary key, could be of type number or string
   * @returns an observable of the specified delete result
   */
  deleteOne$(id: number | string): Observable<DeleteResult> {
    return this.http.delete<DeleteResult>(
      `${this.apiUrl}/${id}`,
      this.httpOptions
    );
  }
}
