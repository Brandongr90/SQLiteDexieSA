import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/* Variable global */
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class OnlineOfflineService {
  /* Esta variable recibe los cambios de conexion | Subject es un observable */
  private internalConnectChanged = new Subject<boolean>();

  /* Verificar si la conexion cambia */
  get connectionChanged() {
    return this.internalConnectChanged.asObservable();
  }

  /* Obtener el estado de conexion */
  get isOnline(){
    return !!window.navigator.onLine;
  }

  constructor() {
    window.addEventListener('Online', ()=> this.updateOnlineStatus());
    window.addEventListener('Offline', ()=> this.updateOnlineStatus());
  }

  private updateOnlineStatus() {
    this.internalConnectChanged.next(window.navigator.onLine)
  }
}