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

  async addData(data: Category) {
    data.id = uuidv4();
    this.Data.push(data);
    if (!this.OnlineOfflineService.isOnline) {
      this.addToIndexDB(data);
    }
  }


  private createDatabase() {
    this.db = new Dexie('MyDatabase');
    this.db.version(1).stores({
      category: 'id, name, phone',
      productos: 'id, name, categoryId', // Nueva tabla 'productos' con campos id, name y categoryId
    });
  }

  private addToIndexDB(Data: Category) {
    this.db.category
      .add(Data)
      .then(async () => {
        const allItems: Category[] = await this.db.category.toArray();
        console.log(allItems);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  async deleteToIndexDB(tabla:string, id: string) {
    await this.db.table(tabla).delete(id);
    this.dataSubject.next([...this.Data]);
  }

  async UpdateToIndexDB(tabla: string, id: any, data:any) {
    this.db.table(tabla).update(id, data).then(() => {
      console.log('Actualizado successfully');
    });
  }


  /* Limpiar BDD */
  eliminarTodo(tabla:string) {
    this.db.table(tabla).clear()
  }

  /* Obtener todas las categorias */
  async getAll(tabla:string) {
    return await this.db.table(tabla).toArray();

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
