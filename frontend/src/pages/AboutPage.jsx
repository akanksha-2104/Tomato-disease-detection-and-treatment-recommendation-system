import React from "react";

const AboutPage = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          About TomatoCare
        </h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="mb-4">
              TomatoCare uses advanced machine learning algorithms to detect
              diseases in tomato plants through leaf image analysis. Our AI
              model has been trained on thousands of images to accurately
              identify various tomato diseases.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Image</h3>
                <p className="text-sm">
                  Take a clear photo of the tomato leaf showing any symptoms
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm">
                  Our model analyzes the image for disease patterns and symptoms
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Get Results</h3>
                <p className="text-sm">
                  Receive diagnosis with confidence score and treatment
                  recommendations
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Detectable Diseases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li>• Early Blight</li>
                <li>• Late Blight</li>
                <li>• Bacterial Spot</li>
                <li>• Septoria Leaf Spot</li>
              </ul>
              <ul className="space-y-2">
                <li>• Target Spot</li>
                <li>• Tomato Yellow Leaf Curl Virus</li>
                <li>• Tomato Mosaic Virus</li>
                <li>• Healthy (No Disease)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tips for Best Results
            </h2>
            <ul className="space-y-2">
              <li>• Use clear, well-lit photos</li>
              <li>• Focus on affected areas of the leaf</li>
              <li>• Avoid blurry or dark images</li>
              <li>• Include the whole leaf when possible</li>
              <li>• Take photos during daylight for better color accuracy</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
