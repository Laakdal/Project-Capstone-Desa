<?php

namespace App\Console\Commands;

use App\Models\Letter;
use Illuminate\Console\Command;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class RegeneratePdfs extends Command
{
    protected $signature = 'letters:regenerate-pdfs';
    protected $description = 'Regenerate PDF files for all letters that have content but no PDF';

    public function handle()
    {
        $this->info('Starting PDF regeneration...');
        
        // Get all letters that have content but no PDF or PDF file doesn't exist
        $letters = Letter::whereNotNull('content')
            ->where('content', '!=', '')
            ->whereIn('status', ['sent', 'continued', 'approved', 'rejected'])
            ->get();
        
        $regenerated = 0;
        $skipped = 0;
        
        foreach ($letters as $letter) {
            // Check if PDF exists
            if ($letter->pdf_path && file_exists(storage_path('app/public/' . $letter->pdf_path))) {
                $this->line("Skipping Letter #{$letter->id} - PDF already exists");
                $skipped++;
                continue;
            }
            
            try {
                // Generate PDF
                $pdf = Pdf::loadView('letters.pdf', ['letterContent' => $letter->content]);
                
                // Create filename
                $filename = 'surat_' . $letter->id . '_' . time() . '.pdf';
                $path = 'letters/' . $filename;
                
                // Save PDF
                Storage::disk('public')->put($path, $pdf->output());
                
                // Update letter
                $letter->update(['pdf_path' => $path]);
                
                $this->info("✓ Generated PDF for Letter #{$letter->id}");
                $regenerated++;
                
            } catch (\Exception $e) {
                $this->error("✗ Failed to generate PDF for Letter #{$letter->id}: " . $e->getMessage());
            }
        }
        
        $this->newLine();
        $this->info("Regeneration complete!");
        $this->info("Regenerated: {$regenerated}");
        $this->info("Skipped: {$skipped}");
        
        return Command::SUCCESS;
    }
}
