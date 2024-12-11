import { Component } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EventsService } from 'src/app/services/events.service';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; // Corrected import
import { PdfUploadService } from 'src/app/services/pdf-upload.service'; // Import the service

@Component({
  selector: 'app-eventlist',
  templateUrl: './eventlist.component.html',
  styleUrls: ['./eventlist.component.css'],
})
export class EventlistComponent {
  events: any = []; // Original event data
  filteredEvents: any = []; // Search-filtered event data
  searchTerm: string = ''; // Search term

  constructor(
    private eventService: EventsService,
    private pdfUploadService: PdfUploadService // Inject the service
  ) {
    this.fetchEvents(); // Fetch events on component initialization
  }

  // Fetch all events from the service
  fetchEvents() {
    this.eventService.getData().subscribe(
      (response: any) => {
        console.log(response.data);
        this.events = response.data;
        this.filteredEvents = response.data;
      },
      (error: AnyCatcher) => {
        console.error(error);
      }
    );
  }

  // Delete event
  deleteUser(id: any) {
    this.eventService.deleteUser(id).subscribe(() => {
      this.fetchEvents(); // Refresh the list after deletion
    });
  }

  // Search events based on title
  onSearch() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredEvents = this.events.filter((event: any) =>
      event.title.toLowerCase().includes(searchLower)
    );
  }

  // Generate PDF for each event and send to backend
  async generatePdf(event: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Corrected font import
    const fontSize = 12;

    // Add event details to the PDF
    page.drawText(`Event Details`, { x: 20, y: height - 40, font, size: 16 });
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

    // Upload PDF to the backend (S3 storage)
    this.uploadPdfToBackend(pdfBlob, `${event.title}.pdf`);
  }

  // Upload PDF to the backend using the service
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
}
