// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class PdfUploadService {

//   private baseUrl = 'http://localhost:3000/upload-pdf';

//   constructor(private http: HttpClient) {}

//   // Upload PDF
//   uploadPdf(pdfBlob: Blob, fileName: string): Observable<any> {
//     const formData = new FormData();
//     formData.append('file', pdfBlob, fileName);
//     return this.http.post(this.baseUrl, formData);
//   }

//   // Get versions of a file
//   getFileVersions(fileName: string): Observable<any> {
//     return this.http.get(`${this.baseUrl}/${fileName}/versions`);
//   }

//   // Download a specific version
//   downloadFileVersion(fileName: string, versionId: string): Observable<Blob> {
//     return this.http.get(`${this.baseUrl}/${fileName}/${versionId}`, { responseType: 'blob' });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfUploadService {
  private baseUrl = 'http://localhost:3000/upload-pdf'; 

  constructor(private http: HttpClient) {}

  uploadPdf(pdfBlob: Blob, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', pdfBlob, fileName);
    console.log(formData);
    return this.http.post(this.baseUrl, formData);
  }
  getFileVersions(crn: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/versions/${crn}`);
  }

  // Download a specific version of the file
  downloadFileVersion(version: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${version}`, {
      responseType: 'blob',
    });
  }
}