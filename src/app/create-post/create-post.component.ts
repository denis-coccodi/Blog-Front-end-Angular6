import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Categoria } from '../models/categoria.model';
import { Utente } from '../models/utente.model';
import { LoginService } from '../services/login.service';
import { post } from 'selenium-webdriver/http';
import { Post } from '../models/post.model';
import { UtilitiesService } from '../services/utilities.service';
import { Tag } from '../models/tag.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  post: Post;
  titolo: String;
  private _categoria: Categoria;
  testo: String;
  utente: Utente;

  categorie: Categoria[];


  constructor(private http: HttpService,
              private login: LoginService,
              private utilities: UtilitiesService) {
  }

  ngOnInit() {

    this.utente = this.login.utente;
    this.login.utenteUpdated.subscribe((utente: Utente) => {
      this.utente = utente;
    });

    this.http.loadCategorie().subscribe(
      (categorie: Categoria[]) => {
        this.categorie = categorie;
        this._categoria = categorie[0];
      });

    this.postForm = new FormGroup({
      'titoloPost': new FormControl(null, [Validators.required]),
      'categoriaPost': new FormControl(null, [Validators.required]),
      'testoPost': new FormControl(null, [Validators.required])
    });
  }

  setCategoria(catNumber: number) {
    this._categoria = this.categorie[catNumber];
  }

  getHashTags(text: string): Tag[] {
    var tags: Tag[] = [];
    var tag: Tag;
    var names: string[];
    names = text.split("#");
    console.log(names);
    for (var i = 0; i < names.length; i++) {
      if (i > 0) {
        console.log(names[i]);
        if(names[i].indexOf(" ") > 0) {
          names[i] = names[i].substr(0, names[i].indexOf(" "));
        } else {
          names[i] = names[i].substr(0);
        }
        tag = new Tag(-1, names[i]);
        tags.push(tag);
      }
    }

    console.log(tags);
    return tags;
  }

  onSubmitNewPost() {

    console.log("posting...");
    if (this.postForm.valid) {

      this.post = new Post(
        null,
        this.postForm.get("titoloPost").value,
        this.postForm.get("testoPost").value,
        this.utilities.dateToString(new Date()),
        true,
        0,
        this._categoria,
        this.utente,
        this.getHashTags(this.postForm.get("testoPost").value)
      );

      this.http.newPost(this.post).subscribe(
        result => {
          console.log(result);
        }
      );
      this.postForm.reset();
    }
  }


}