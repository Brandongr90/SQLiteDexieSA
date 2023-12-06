import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { v4 as uuidv4 } from 'uuid';
import { OnlineOfflineService } from './online-offline.service';
import Dexie from 'dexie';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private Data: Category[] = [];
  private db: any;
  private dataSubject = new BehaviorSubject<Category[]>([]);

  constructor(private readonly OnlineOfflineService: OnlineOfflineService) {
    // this.registerToEvents(OnlineOfflineService);
    this.createDatabase();
  }

  private createDatabase() {
    this.db = new Dexie('MyDatabase');
    this.db.version(1).stores({
      category: 'id, name, phone',
      productos: 'id, name, categoryId', // Nueva tabla 'productos' con campos id, name y categoryId
    });
  }

  // async addData(data: Category) {
  //   data.id = uuidv4();
  //   this.Data.push(data);


  //   if (!this.OnlineOfflineService.isOnline) {
  //     this.addToIndexDB(data);
  //   }


  // }



  async addToIndexDB( tabla:string, Data: any) {
    if (!this.OnlineOfflineService.isOnline) {
      Data.id = await uuidv4();
      this.db.table(tabla).add(Data);
    }
  }

  async deleteToIndexDB(tabla:string, id: string) {
    if (!this.OnlineOfflineService.isOnline) {
      await this.db.table(tabla).delete(id);
      this.dataSubject.next([...this.Data]);
    }
  }

  async UpdateToIndexDB(tabla: string, id: any, data:any) {
    if (!this.OnlineOfflineService.isOnline) {
      this.db.table(tabla).update(id, data).then(() => {
        console.log('Actualizado successfully');
      });
    }
  }


  /* Limpiar BDD */
  async eliminarTodo(tabla:string) {
    if (!this.OnlineOfflineService.isOnline) {
      this.db.table(tabla).clear()
    }
  }

  /* Obtener todas las categorias */
  async getAll(tabla:string) {
    if (!this.OnlineOfflineService.isOnline) {
      return await this.db.table(tabla).toArray();
    }
  }
  // private registerToEvents(OnlineOfflineService: OnlineOfflineService) {
  //   OnlineOfflineService.connectionChanged.subscribe((online: any) => {
  //     if (online) {
  //       console.log('Send Data');
  //       this.sendItemsFromIndexDB();
  //     } else {
  //       console.log('Save Data Locale');
  //     }
  //   });
  // }

  // private async sendItemsFromIndexDB() {
  //   const allItems: Category[] = await this.db.category.toArray();
  //   allItems.forEach((item: Category) => {
  //     this.db.category.delete(item.id).then(() => {
  //       console.log(`Item: ${item.id}`);
  //     });
  //   });
  // }

  // getData() {
  //   return this.Data;
  // }
}
