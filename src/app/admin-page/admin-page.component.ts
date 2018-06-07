import { Component, OnInit } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { Tag } from '../models/tag.model';
import { Commento } from '../models/commento.model';
import { UtilitiesService } from '../services/utilities.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from '../services/categoria.service';
import { TagService } from '../services/tag.service';
import { CommentoService } from '../services/commento.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  categorie: Categoria[];
  newCategoryForm: FormGroup;
  tags: Tag[];
  commenti: Commento[];
  commento: Commento = null;
  errMsg: string = "";

  constructor(private cSvc: CategoriaService,
              private tSvc: TagService,
              private coSvc: CommentoService,
              public utilities: UtilitiesService) {
  }

  ngOnInit() {
    this.cSvc.loadCategorie().subscribe(
      (categorie: Categoria[]) => {
        this.cSvc.categorie = categorie;
        this.categorie = categorie;
      });

    this.cSvc.categorieUpdated.subscribe((cat: Categoria[]) => {
      this.categorie = cat;
    });

    this.tSvc.loadTags().subscribe(
      (tags: Tag[]) => {
        this.tSvc.tags = tags;
        this.tags = tags;
      }
    );

    this.tSvc.tagsUpdated.subscribe((tags: Tag[]) => {
      this.tags = tags;
    });

    this.coSvc.loadCommenti().subscribe(
      (commenti: Commento[]) => {
        this.coSvc.commenti = commenti;
        this.commenti = commenti;
      }
    );

    this.coSvc.commentiUpdated.subscribe((commenti: Commento[]) => {
      this.commenti = commenti;
    });

    this.newCategoryForm = new FormGroup({
      'nomeCat': new FormControl(null, [
        Validators.required
      ]),
      'descCat': new FormControl(null),
      'imgCat': new FormControl(null)
    });
  }

  onSubmitNewCategory() {
    if (this.newCategoryForm.valid) {
      const cat: Categoria = new Categoria(
        -1,
        this.newCategoryForm.get('nomeCat').value,
        this.newCategoryForm.get('descCat').value,
        this.newCategoryForm.get('imgCat').value,
        null
      )
      this.cSvc.insertCategoria(cat)
        .subscribe(
          (result: boolean) => {
            console.log(result);
            if (result) {
              this.cSvc.loadCategorie().subscribe(
                (categorie: Categoria[]) => {
                  this.categorie = categorie;
                  $('#catModalClose').click();
                });
            }
          },
          err => {
            console.log("Errore di comunicazione col server: " + err);
          }
        );
      this.newCategoryForm.reset();
    } else {
      if (!this.newCategoryForm.get('nomeCat').valid) {
        this.errMsg = 'Inserire il nome di una categoria!';
      }
    }
  }

  setCommento(commento: Commento) {
    this.commento = commento;
  }

  updateVisibility(commento: Commento) {
    this.coSvc.updateVisibility('true', commento.id).subscribe(
      (callResult: boolean) => {
        console.log(callResult);
        if (callResult) {
          this.coSvc.loadCommenti().subscribe(
            (commenti: Commento[]) => {
              this.commenti = commenti;
            }
          );
        }
      }
    );
  }

  deleteCommento(id: number) {
    this.coSvc.deleteCommento(id).subscribe(
      (callResult: boolean) => {
        console.log(callResult);
        if (callResult) {
          this.coSvc.loadCommenti().subscribe(
            (commenti: Commento[]) => {
              this.commenti = commenti;
            }
          );
        }
      }
    )
  }

  deleteTag(id: number) {
    this.tSvc.deleteTag(id).subscribe(
      (callResult: boolean) => {
        console.log(callResult);
        if (callResult) {
          this.tSvc.loadTags().subscribe(
            (tags: Tag[]) => {
              this.tags = tags;
            }
          );
        }
      }
    )
  }

  deleteCategoria(id: number) {
    this.cSvc.deleteCategoria(id).subscribe(
      (callResult: boolean) => {
        console.log(callResult);
        if (callResult) {
          this.cSvc.loadCategorie().subscribe(
            (categorie: Categoria[]) => {
              this.categorie = categorie;
            }
          );
        }
      }
    )
  }
}
