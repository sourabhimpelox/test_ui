// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { EventsService } from 'src/app/services/events.service';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import { PdfUploadService } from 'src/app/services/pdf-upload.service';

// @Component({
//   selector: 'app-event-details',
//   templateUrl: './event-details.component.html',
//   styleUrls: ['./event-details.component.css']
// })
// export class EventDetailsComponent implements OnInit {
//   event: any; // Store event details
//   eventId: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private eventService: EventsService,
//     private pdfUploadService: PdfUploadService
//   ) {}

//   ngOnInit(): void {
//     this.eventId = this.route.snapshot.paramMap.get('id') || '';
//     if (this.eventId) {
//       this.getEventDetails();
//     } else {
//       console.error('Event ID is missing.');
//     }
//   }

//   getEventDetails(): void {
//     this.eventService.getDataById(this.eventId).subscribe({
//       next: (response: any) => {
//         this.event = response.data; // Assuming the response contains the event data
//       },
//       error: (err) => {
//         console.error('Error fetching event details:', err);
//       }
//     });
//   }

//   // Generate PDF for the event
//   async generatePdf(event: any) {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 400]);
//     const { height } = page.getSize();
//     const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//     const fontSize = 12;

//     // Add event details to the PDF
//     page.drawText('Event Details', { x: 20, y: height - 40, font, size: 16 });
//     page.drawText(`ID: ${event.id}`, { x: 20, y: height - 60, font, size: fontSize });
//     page.drawText(`Event: ${event.title}`, { x: 20, y: height - 80, font, size: fontSize });
//     page.drawText(`Description: ${event.description}`, { x: 20, y: height - 100, font, size: fontSize });

//     // Save PDF as bytes
//     const pdfBytes = await pdfDoc.save();

//     // Trigger the file download in the browser
//     const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(pdfBlob);
//     link.download = `${event.title}.pdf`; // Set the download file name
//     link.click();

//     // Upload PDF to the backend
//     this.uploadPdfToBackend(pdfBlob, `${event.title}.pdf`);
//   }

//   // Upload PDF to the backend
//   uploadPdfToBackend(pdfBlob: Blob, fileName: string) {
//     this.pdfUploadService.uploadPdf(pdfBlob, fileName).subscribe(
//       (response: any) => {
//         console.log('PDF uploaded successfully', response);
//       },
//       (error) => {
//         console.error('Error uploading PDF', error);
//       }
//     );
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PdfUploadService } from 'src/app/services/pdf-upload.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any; // Store event details
  eventId: string = '';
  latestWordVersion: boolean = false; // Flag for checking if the latest Word version exists
  versions: any[] = []; // Store event file versions

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private pdfUploadService: PdfUploadService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.getEventDetails();
    } else {
      console.error('Event ID is missing.');
    }
  }

  getEventDetails(): void {
    this.eventService.getDataById(this.eventId).subscribe({
      next: (response: any) => {
        this.event = response.data; // Assuming the response contains the event data
        this.loadFileVersions();
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });
  }

  
  // Generate PDF for the event
  async generatePdf(event: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    
    // Add event details to the PDF
    page.drawText('Event Details', { x: 20, y: height - 40, font, size: 16 });
    page.drawText(`ID: ${event.id}`, { x: 20, y: height - 60, font, size: fontSize });
    page.drawText(`Event: ${event.title}`, { x: 20, y: height - 80, font, size: fontSize });
    page.drawText(`Description: ${event.description}`, { x: 20, y: height - 100, font, size: fontSize });
    
    // Save PDF as bytes
    const pdfBytes = await pdfDoc.save();
    
    // Trigger the file download in the browser
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `${event.title}.pdf`; // Set the download file name
    link.click();
    
    // Upload PDF to the backend
    this.uploadPdfToBackend(pdfBlob, `${event.title}.pdf`);
  }
  
  // Upload PDF to the backend
  uploadPdfToBackend(pdfBlob: Blob, fileName: string) {
    this.pdfUploadService.uploadPdf(pdfBlob, fileName).subscribe(
      (response: any) => {
        console.log('PDF uploaded successfully', response);
      },
      (error) => {
        console.error('Error uploading PDF', error);
      }
    );
  }
  // Load file versions from the backend
  loadFileVersions() {
    this.pdfUploadService.getFileVersions(this.eventId).subscribe((versions) => {
      this.versions = versions;
      console.log(this.versions);
      this.checkForWordFile(versions);
    });
  }

  // Check if the latest version has a Word file available
  checkForWordFile(versions: any[]) {
    if (versions.length > 0) {
      const latestVersion = versions[0]; // Assuming the first item is the latest
      this.latestWordVersion = latestVersion.s3WordPath ? true : false;
    }
  }

  // Download Word file of the latest version
  downloadWord() {
    if (this.latestWordVersion) {
      const latestVersion = this.versions[0];
      this.pdfUploadService.downloadWordFile(this.eventId, latestVersion.version).subscribe((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${this.event.title}-word-${latestVersion.version}.docx`; // Set the download file name
        link.click();
      });
    } else {
      alert('Word file not available for this version.');
    }
  }
}
