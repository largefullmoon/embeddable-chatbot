import PyPDF2
from docx import Document as DocxDocument
import os

class DocumentParser:
    def parse(self, file_path, file_type):
        """
        Parse a document and extract text content
        """
        if file_type == 'pdf':
            return self._parse_pdf(file_path)
        elif file_type == 'docx':
            return self._parse_docx(file_path)
        elif file_type == 'txt':
            return self._parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _parse_pdf(self, file_path):
        """Parse PDF file"""
        text = []
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
            return '\n'.join(text)
        except Exception as e:
            raise Exception(f"Failed to parse PDF: {str(e)}")
    
    def _parse_docx(self, file_path):
        """Parse DOCX file"""
        try:
            doc = DocxDocument(file_path)
            text = []
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text.append(paragraph.text)
            return '\n'.join(text)
        except Exception as e:
            raise Exception(f"Failed to parse DOCX: {str(e)}")
    
    def _parse_txt(self, file_path):
        """Parse TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Failed to parse TXT: {str(e)}")
    
    def parse_notion_url(self, url):
        """
        Parse content from a Notion page URL
        This would require Notion API integration
        """
        # Placeholder - would need Notion API token and implementation
        raise NotImplementedError("Notion integration not yet implemented")

