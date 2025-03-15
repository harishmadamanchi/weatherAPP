import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export const ApiKeyInterceptor : HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const apiKey = environment.apiKey;
    
    // I want to exclude for images weather icons request
    if (req.url.match(/\.(png|jpg|jpeg|svg|gif)$/i)) {
      return next(req); 
    }
    // other requests adding appid as query param
    const clonedRequest = req.clone({
      setParams: { appid: apiKey }
    });

    return next(clonedRequest);
  
}
