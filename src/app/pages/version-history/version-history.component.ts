

import { Component, OnInit } from '@angular/core';
import { PdfUploadService } from 'src/app/services/pdf-upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-version-history',
  templateUrl: './version-history.component.html',
  styleUrls: ['./version-history.component.css']
})
export class VersionHistoryComponent implements OnInit {
  crn: string = ''; // The CRN of the file
  versions: { id: number, crn: string, version: string, s3Path: string }[] = [];

  constructor(
    private pdfService: PdfUploadService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.crn = this.route.snapshot.paramMap.get('crn') || ''; 
    console.log(this.crn);
    if (this.crn) {
      this.getFileVersions();
    } else {
      console.error('CRN parameter is missing.');
    }
  }

  getFileVersions(): void {
    this.pdfService.getFileVersions(this.crn).subscribe({
      next: (response: any) => {
        console.log('Received versions -->', response);
        this.versions = response?.data.data
      },
      error: (err) => {
        console.error('Error fetching file versions:', err);
      }
    });
  }

  // Download a specific version of the Word file
  downloadVersion(version: string): void {
    this.pdfService.downloadWordFile(this.crn, version).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.crn}-${version}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading version:', err);
      }
    });
  }
}
