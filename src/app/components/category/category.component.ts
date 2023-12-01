import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  alertaUno: boolean = false;

  Data: Category[] = [];

  Formulario: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  FormularioUpdate: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  constructor(private readonly CategoryService: CategoryService) {
    /* this.Data = this.CategoryService.getData(); */
  }

  ngOnInit() {
    this.traerTodaLaData();
  }

  addSave() {
    this.CategoryService.addData(this.Formulario.value).then(() => {
      this.Formulario.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    })
  }

  deleteData(id: any) {
    this.CategoryService.deleteCategory(id)
    .then(() => {
      this.FormularioUpdate.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    })
  }

  actualizarData() {    
    this.CategoryService.UpdateToIndexDB(this.FormularioUpdate.value.id, this.FormularioUpdate.value.name).then(() => {
      this.Formulario.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  editCategory(category: Category) {
    this.FormularioUpdate.setValue({ id: category.id, name: category.name });
  }

  eliminarTodo() {
    this.CategoryService.eliminarTodo()
  }

  traerTodaLaData() {
    this.CategoryService.getAllCategories().then(categories => {
      this.Data = categories;
    });
  }
  
  alertaUnoOff() {
    this.alertaUno = false;
  }
}