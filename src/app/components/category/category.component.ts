import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Productos } from 'src/app/models/productos';
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
  categories: Category[] = [];
  productos: Productos[] = [];

  /* Formulario Agregar */
  categoryFormulario: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  /* Formulario Agregar */
  productoFormulario: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
  });

  /* Formulario Actualizar */
  categoryUpdate: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  productoUpdate: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
  });

  /* Llamamos a el servicio */
  constructor(private readonly cs: CategoryService) { }

  /* Traer toda la data al cargar */
  ngOnInit() {
    this.traerCategories();
    this.traerProductos();
  }

  /* Añadir Nueva Categoria */
  addCategory() {
    this.cs.addData(this.categoryFormulario.value, 'category').then(() => {
      this.categoryFormulario.reset();
      this.traerCategories();
      this.alertaUno = true;
      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
      
    });
  }

  addProducto() {
    this.cs.addData(this.productoFormulario.value, 'product').then(() => {
      this.productoFormulario.reset();
      this.traerProductos();
      this.alertaUno = true;
      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Eliminar Categoria */
  deleteCategory(id: any) {
    this.cs.deleteToIndexDB("category", id).then(() => {
      this.categoryUpdate.reset();
      this.traerCategories();
      this.alertaUno = true;
      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  deleteProducto(id: any) {
    this.cs.deleteToIndexDB("product", id).then(() => {
      this.productoUpdate.reset();
      this.traerProductos();
      this.alertaUno = true;
      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Actualizar Categoria */
  actualizarCategory() {
    var newdata = {
      name: this.categoryUpdate.value.name
    };
    this.cs.updateToIndexDB(
      "category",
      this.categoryUpdate.value.id,
      newdata
    ).then(() => {
      this.categoryUpdate.reset();
      this.traerCategories();
      this.alertaUno = true;

      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  actualizarProducto() {
    var newdata = {
      name: this.productoUpdate.value.name,
      category_id: this.productoUpdate.value.category_id
    };
    this.cs.updateToIndexDB(
      "product",
      this.productoUpdate.value.id,
      newdata
    ).then(() => {
      this.productoUpdate.reset();
      this.traerProductos();
      this.alertaUno = true;
      setTimeout(() => {
        this.alertaUno = false;
      }, 3000);
    });
  }

  /* Parchar el input de actualizar */
  editCategory(category: Category) {
    this.categoryUpdate.setValue({ id: category.id, name: category.name });
  }

  editProducto(producto: Productos) {
    console.log(producto);
    this.productoUpdate.setValue({ id: producto.id, name: producto.name, category_id: producto.category_id });
  }

  /* Limpiar todo de la BDD */
  eliminarCategories() {
    this.cs.eliminarTodo("category").then(() => {
      this.categoryFormulario.reset();
      this.traerCategories();
      this.alertaUno = true;
    });
  }

  eliminarProductos() {
    this.cs.eliminarTodo("product").then(() => {
      this.productoFormulario.reset();
      this.traerProductos();
      this.alertaUno = true;
    });
  }

  /* Obtener todo lo que esta guardado */
  traerCategories() {
    this.cs.getAll("category").then((categories) => {
      this.categories = categories;
    });
  }

  traerProductos() {
    this.cs.getAll("product").then((productos) => {
      this.productos = productos;
    });
  }

  /* Cerrar Alerta X */
  alertaUnoOff() {
    this.alertaUno = false;
  }
}
