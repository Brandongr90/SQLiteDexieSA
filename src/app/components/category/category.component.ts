import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  /* Variable para activar la alerta */
  alertaUno: boolean = false;
  /* Informacion de la bdd */
  Data: Category[] = [];

  /* Formulario Agregar */
  Formulario: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  /* Formulario Actualizar */
  FormularioUpdate: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  /* Llamamos a el servicio */
  constructor(private readonly CategoryService: CategoryService) {}

  /* Traer toda la data al cargar */
  ngOnInit() {
    this.traerTodaLaData();
  }

  /* Añadir Nueva Categoria */
  addSave() {
    this.CategoryService.addData(this.Formulario.value).then(() => {
      this.Formulario.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Eliminar Categoria */
  deleteData(id: any) {
    this.CategoryService.deleteCategory(id).then(() => {
      this.FormularioUpdate.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Actualizar Categoria */
  actualizarData() {
    this.CategoryService.UpdateToIndexDB(
      this.FormularioUpdate.value.id,
      this.FormularioUpdate.value.name
    ).then(() => {
      this.Formulario.reset();
      this.traerTodaLaData();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Parchar el input de actualizar */
  editCategory(category: Category) {
    this.FormularioUpdate.setValue({ id: category.id, name: category.name });
  }

  /* Limpiar todo de la BDD */
  eliminarTodo() {
    this.CategoryService.eliminarTodo();
  }

  /* Obtener todo lo que esta guardado */
  traerTodaLaData() {
    this.CategoryService.getAllCategories().then((categories) => {
      this.Data = categories;
    });
  }

  /* Cerrar Alerta X */
  alertaUnoOff() {
    this.alertaUno = false;
  }
}
