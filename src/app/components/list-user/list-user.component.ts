import { Component } from '@angular/core';
import { GenericService } from '../../shared/generic.service';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, DialogComponent, FormsModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  providers:  [ GenericService ]

})
export class ListUserComponent {

  recordsPerPageOptions = [5, 10, 20];
  recordsPerPage: number = 5;
  showDialog: boolean = false;
  idEliminar: any;
  currentPage = 1;
  totalPages = 1;
  currentRecords: any[] = [];
  bakupcurrentRecords: any[] = [];
  paginatedRecords: any[] = [];

  constructor(private genericService: GenericService, private router: Router) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.genericService.get().subscribe({
      next: (data: any) => {
        this.bakupcurrentRecords = [...data.data];
        this.currentRecords = [...data.data];
        this.updatePagination();
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('Se completó con éxito');
      }
    });
  }

  filterTable(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.currentRecords = [...this.bakupcurrentRecords]; 
    } else {
      this.currentRecords = this.bakupcurrentRecords.filter(item =>
        item.description.toLowerCase().includes(input.value.toLowerCase())
      );
    }
    this.currentPage = 1; 
    this.updatePagination();
  }

  navigateToAbout() {
    this.router.navigate(['/newUser/null']);
  }

  editRecord(record: any) {
    this.router.navigate([`/newUser/${record.id}`]);
  }

  deleteRecord(record: any) {
    this.idEliminar = record;
    this.showDialog = true;
    console.log('Eliminar registro', record);
  }

  openDialog(): void {
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  confirmDelete(): void {
    this.genericService.delete(this.idEliminar.id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error: any) => {
        alert('No se encontraron resultados.');
        console.log(error);
      },
      complete: () => {
        console.log('Se completó con éxito');
        alert('Se eliminó el registro con éxito.');
      }
    });
    this.closeDialog();
  }

  updateRecordsPerPage(event: any): void {
    this.recordsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1; 
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.currentRecords.length / this.recordsPerPage);
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.paginatedRecords = this.currentRecords.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
