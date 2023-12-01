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

  async addData(data: Category) {
    data.id = uuidv4();
    this.Data.push(data);
    if (!this.OnlineOfflineService.isOnline) {
      this.addToIndexDB(data);
    }
  }

  getData() {
    return this.Data;
  }

  constructor(private readonly OnlineOfflineService: OnlineOfflineService) {
    this.registerToEvents(OnlineOfflineService);
    this.createDatabase();
  }

  private createDatabase() {
    this.db = new Dexie('MyDatabase');
    this.db.version(1).stores({
      category: 'id, name',
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

  /* DeleteToIndexDB(id: any) {
    this.db.category.delete(id).then(() => {
      console.log('Eliminado successfully');
    });
  } */

  async deleteCategory(categoryId: string) {
    await this.db.category.delete(categoryId);
    this.dataSubject.next([...this.Data]);
  }

  async UpdateToIndexDB(id: any, name:any) {   
    this.db.category.update(id, {name: name}).then(() => {
      console.log('Actualizado successfully');
    });
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
    const allItems: Category[] = await this.db.category.toArray();
    allItems.forEach((item: Category) => {
      this.db.category.delete(item.id).then(() => {
        console.log(`Item: ${item.id}`);
      });
    });
  }

  eliminarTodo() {
    this.db.category.clear()
  }

  async getAllCategories() {
    const categories: Category[] = await this.db.category.toArray();
    return categories.map((category: Category) => ({
      id: category.id!,
      name: category.name
    }));
  }

}