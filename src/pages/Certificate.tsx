import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Download, Share2, CheckCircle, Calendar,
  User, BookOpen, ExternalLink, Printer
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const certificateData = {
  certificateNumber: 'OMG-2025-A1B2C3',
  studentName: 'Adaeze Okonkwo',
  courseName: 'The Omugwo Masterclass for Moms',
  completionDate: '2025-02-15',
  instructor: 'Dr. Megor Ikuenobe',
  hoursCompleted: 12,
  lessonsCompleted: 48,
};

export const Certificate: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // In production, generate PDF using a library like jsPDF or html2canvas
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `Certificate - ${certificateData.courseName}`,
        text: `I completed ${certificateData.courseName} at Omugwo Academy!`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
              Share
            </Button>
            <Button onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          ref={certificateRef}
        >
          <Card className="p-0 overflow-hidden print:shadow-none">
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-10 h-10" />
                <span className="text-2xl font-black tracking-wider">OMUGWO ACADEMY</span>
              </div>
              <p className="text-primary-200 text-sm tracking-widest uppercase">Certificate of Completion</p>
            </div>

            <div className="p-12 text-center bg-white">
              <p className="text-gray-500 mb-2">This is to certify that</p>
              <h1 className="text-4xl font-black text-gray-900 mb-6 font-serif">
                {certificateData.studentName}
              </h1>

              <p className="text-gray-500 mb-2">has successfully completed</p>
              <h2 className="text-2xl font-bold text-primary-600 mb-6">
                {certificateData.courseName}
              </h2>

              <div className="flex items-center justify-center gap-8 mb-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(certificateData.completionDate).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {certificateData.hoursCompleted} hours
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {certificateData.lessonsCompleted} lessons
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="w-48 border-b-2 border-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">{certificateData.instructor}</p>
                    <p className="text-sm text-gray-500">Founder & Lead Educator</p>
                  </div>
                  <div>
                    <div className="w-48 border-b-2 border-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Omugwo Academy</p>
                    <p className="text-sm text-gray-500">Official Seal</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Certificate ID: {certificateData.certificateNumber}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Verify at: omugwoacademy.com/verify/{certificateData.certificateNumber}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Verification Info */}
        <Card className="mt-6 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Verified Certificate</h3>
              <p className="text-sm text-gray-600 mb-3">
                This certificate is authentic and can be verified using the certificate ID above.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="success">Verified</Badge>
                <span className="text-sm text-gray-500">
                  Issued on {new Date(certificateData.completionDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Share on LinkedIn */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Share Your Achievement</h3>
              <p className="text-sm text-gray-600">
                Add this certificate to your LinkedIn profile to showcase your skills.
              </p>
            </div>
            <Button variant="outline" rightIcon={<ExternalLink className="w-4 h-4" />}>
              Add to LinkedIn
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

