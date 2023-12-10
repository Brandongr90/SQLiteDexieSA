import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { v4 as uuidv4 } from 'uuid';
import { OnlineOfflineService } from './online-offline.service';
import Dexie from 'dexie';
import { BehaviorSubject } from 'rxjs';
import { Productos } from '../models/productos';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categorias: Category[] = [];
  private productos: Productos[] = [];
  private db: any;
  private dataSubject = new BehaviorSubject<Category[]>([]);

  constructor(private readonly OnlineOfflineService: OnlineOfflineService) {
    this.registerToEvents(OnlineOfflineService);
    this.createDatabase();
  }

  private createDatabase() {
    this.db = new Dexie('BasedeDatos');
    this.db.version(1).stores({
      category: 'id, name',
      product: 'id, name, category_id', // Nueva tabla 'productos' con campos id, name y categoryId
    });
  }

  async addData(data: Category | Productos, tabla: string) {
    data.id = uuidv4();
    if (tabla == 'category') {
      this.categorias.push(data as Category);
    }
    if (tabla == 'product') {
      this.productos.push(data as Productos);
    }
    if (!this.OnlineOfflineService.isOnline) {
      this.addToIndexDB(tabla, data);
    }
  }

  async addToIndexDB(tabla: string, data: any) {
    if (!this.OnlineOfflineService.isOnline) {
      data.id = uuidv4();
      this.db.table(tabla).add(data);
    }
  }

  async deleteToIndexDB(tabla: string, id: string) {
    if (!this.OnlineOfflineService.isOnline) {
      await this.db.table(tabla).delete(id);
      this.dataSubject.next([...this.categorias]);
    }
  }

  async updateToIndexDB(tabla: string, id: any, data:any) {
    if (!this.OnlineOfflineService.isOnline) {
      this.db.table(tabla).update(id, data).then(() => {
        console.log('Actualizado successfully');
      });
    }
  }

  /* Limpiar BDD */
  async eliminarTodo(tabla: string) {
    if (!this.OnlineOfflineService.isOnline) {
      this.db.table(tabla).clear()
    }
  }

  /* Obtener todas las categorias */
  async getAll(tabla: string) {
    if (!this.OnlineOfflineService.isOnline) {
      return await this.db.table(tabla).toArray();
    }
  }

  private registerToEvents(OnlineOfflineService: OnlineOfflineService) {
    OnlineOfflineService.connectionChanged.subscribe((online: any) => {
      if (online) {
        console.log('Send Data');
        this.sendItemsFromIndexDB();
      } else {
        console.log('Save Data Locale');
      }
    });
  }

  private async sendItemsFromIndexDB() {
    const allCategories: Category[] = await this.db.category.toArray();
    const allProducts: Productos[] = await this.db.product.toArray();
    allCategories.forEach((item: Category) => {
      this.db.category.delete(item.id).then(() => {
        console.log(`Item: ${item.id}`);
      });
    });
    allProducts.forEach((item: Category) => {
      this.db.product.delete(item.id).then(() => {
        console.log(`Item: ${item.id}`);
      });
    });
    this.productos.splice(0);
    this.categorias.splice(0);
  }

  getData(tabla: string) {
    if (tabla == 'product') {
      return this.productos;
    }
    if (tabla == 'category') {
      return this.categorias;
    }
    return '';
  }
}
