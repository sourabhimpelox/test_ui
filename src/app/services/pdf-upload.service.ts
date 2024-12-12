import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfUploadService {
  private baseUrl = 'http://localhost:4000/upload-pdf';  // Adjust this with your backend URL

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

  // Download a specific version of the Word file
  downloadWordFile(crn: string, version: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download-word/${crn}/${version}`, {
      responseType: 'blob',  // Ensure it's treated as a binary file
    });
  }
}
