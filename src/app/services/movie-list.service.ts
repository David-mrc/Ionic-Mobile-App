import { Injectable, inject } from '@angular/core';
import { MovieList, MovieLists } from '../models/movie-list';
import { Movie, Movies } from '../models/movie';
import { ToastController } from '@ionic/angular/standalone';
import { Observable, combineLatestWith, firstValueFrom, map, mergeMap, of, switchMap } from 'rxjs';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, or } from '@angular/fire/firestore';
import { presentToast } from 'src/app/helper/toast';
import { computedAsync } from '@appstrophe/ngx-computeasync';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovieListService {
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly userService = inject(UserService);
  private readonly toastController = inject(ToastController);
  private readonly firestore = inject(Firestore);

  private user$ = this.authService.user$.pipe(
    mergeMap(user => user ? this.userService.getById(user?.uid) : of(null))
  );
  private user = computedAsync(() => this.user$);

  private listsRef = collection(this.firestore, 'lists');

  getAll(): Observable<MovieLists> {
    return this.user$.pipe(
      switchMap(user => user ? this.getUserLists(user.name) : [])
    );
  }

  get(listId: string): Observable<MovieList | null> {
    const listRef = doc(this.listsRef, listId);
    const list$ = docData(listRef, { idField: 'id' }) as Observable<MovieList>;
    const moviesRef = collection(this.listsRef, `${listId}/movies`);
    const movies$ = collectionData(moviesRef, { idField: 'id' }) as Observable<Movies>;

    return list$.pipe(
      combineLatestWith(movies$),
      map(([list, movies]) => this.canCurrentUserRead(list) ? {...list, movies} : null)
    );
  }

  async addList(list: Partial<MovieList>): Promise<void> {
    const user = this.user();
    if (!user) {
      throw new Error;
    }
    await addDoc(this.listsRef, { owner: user.name, ...list });
    presentToast('success', 'Movie list successfully created', this.toastController);
  }

  async addMovie(movie: Partial<Movie>, image: File, listId: string): Promise<void> {
    const moviesRef = collection(this.listsRef, `${listId}/movies`);
    const movieRef = await addDoc(moviesRef, movie);

    if (image.name !== "") {
      await this.storageService.uploadMovieImage(image, listId, movieRef.id);
      const imageURL = await this.storageService.getMovieImageURL(listId, movieRef.id);
      await updateDoc(movieRef, { image: imageURL });
    }
    presentToast('success', 'Movie successfully created', this.toastController);
  }

  async deleteList(list: MovieList): Promise<void> {
    const moviesRef = collection(this.listsRef, `${list.id}/movies`);
    const movies$ = collectionData(moviesRef, { idField: 'id' }) as Observable<Movies>;
    const movies = await firstValueFrom(movies$);

    await Promise.all(movies.map(movie => this.deleteMovie(movie, list.id)));
    await deleteDoc(doc(this.listsRef, list.id));
    presentToast('success', 'Movie list successfully deleted', this.toastController);
  }

  async deleteMovie(movie: Movie, listId: string): Promise<void> {
    const movieRef = doc(this.listsRef, `${listId}/movies/${movie.id}`);
    await this.storageService.deleteMovieImage(listId, movie.id);
    await deleteDoc(movieRef);
    presentToast('success', 'Movie successfully deleted', this.toastController);
  }

  async editList(list: Partial<MovieList>, listId: string): Promise<void> {
    await updateDoc(doc(this.listsRef, listId), list);
    presentToast('success', 'Movie list successfully modified', this.toastController);
  }

  async editMovie(movie: Partial<Movie>, image: File, listId: string, movieId: string): Promise<void> {
    const movieRef = doc(this.listsRef, `${listId}/movies/${movieId}`);

    if (image.name !== "") {
      await this.storageService.uploadMovieImage(image, listId, movieId);
      movie.image = await this.storageService.getMovieImageURL(listId, movieId);
    }
    await updateDoc(movieRef, movie);
    presentToast('success', 'Movie successfully modified', this.toastController);
  }

  isCurrentUserOwner(list: MovieList): boolean {
    const username = this.user()?.name;
    return !!username && list.owner === username;
  }

  canCurrentUserEdit(list: MovieList): boolean {
    const username = this.user()?.name;
    return !!username && (
      list.owner === username || list.editors.includes(username)
    );
  }

  canCurrentUserRead(list: MovieList): boolean {
    const username = this.user()?.name;
    return !!username && (
      list.owner === username ||
      list.editors.includes(username) ||
      list.readers.includes(username)
    );
  }

  private getUserLists(username: string): Observable<MovieLists> {
    const q = query(this.listsRef,
      or(
        where("owner", "==", username),
        where("editors", "array-contains", username),
        where("readers", "array-contains", username)
      )
    );
    return collectionData(q, { idField: 'id' }) as Observable<MovieLists>;
  }
}
