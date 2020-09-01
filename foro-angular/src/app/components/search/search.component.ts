import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Topic } from '../../models/topic';
import { TopicService } from '../../services/topic.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: '../topics/topics.component.html',
  styleUrls: ['./search.component.css'],
  providers: [TopicService]
})
export class SearchComponent implements OnInit {

  public page_title: string;
  public topics: Topic[];
  public no_paginate;

  public totalPages;
  public page;
  public next_page;
  public prev_page;
  public number_pages;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _topicService: TopicService
  ) {
    this.page_title = 'Buscar:';
    this.no_paginate = true;
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      var search = params['search'];

      this.page_title = this.page_title + ' ' + search;

      this.getTopics(search);

    });
  }

  getTopics(search){
    this._topicService.search(search).subscribe(
      response => {
        if(response.topics){
          console.log(response);
          this.topics = response.topics;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
