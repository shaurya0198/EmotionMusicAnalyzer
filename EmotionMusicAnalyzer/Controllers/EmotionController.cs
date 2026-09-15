using EmotionMusicAnalyzer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ML.OnnxRuntime;

namespace EmotionMusicAnalyzer.Controllers
{
    public class EmotionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Detect([FromBody] ImageRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Image))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "No image received."
                });
            }

            // Temporary result.
            // We will replace this with the actual AI model later.

            string emotion = "Happy";
            float confidence = 0.87f;

            return Json(new
            {
                success = true,
                emotion = emotion,
                confidence = confidence
            });
        }

        [HttpGet]
        public IActionResult Recommendations(string emotion)
        {
            var songs = new List<Song>
            {
                new Song
                {
                    Id = 1,
                    Title = "Happy Song",
                    Artist = "Artist 1",
                    Genre = "Pop",
                    Emotion = "Happy",
                    FilePath = "/music/happy1.mp3"
                },

                new Song
                {
                    Id = 2,
                    Title = "Dance Track",
                    Artist = "Artist 2",
                    Genre = "Dance",
                    Emotion = "Happy",
                    FilePath = "/music/happy2.mp3"
                },

                new Song
                {
                    Id = 3,
                    Title = "Chill Vibes",
                    Artist = "Artist 3",
                    Genre = "Lo-Fi",
                    Emotion = "Sad",
                    FilePath = "/music/sad1.mp3"
                }
            };

            var result = songs
                .Where(x => x.Emotion.Equals(
                    emotion,
                    StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Json(result);
        }
        [HttpGet]
        public IActionResult ModelInfo()
        {
            string modelPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "models",
                "emotion-model.onnx"
            );

            if (!System.IO.File.Exists(modelPath))
            {
                return Json(new
                {
                    success = false,
                    message = "Model file not found.",
                    path = modelPath
                });
            }

            using var session = new InferenceSession(modelPath);

            var inputs = session.InputMetadata
                .Select(x => new
                {
                    Name = x.Key,
                    Type = x.Value.ElementType.ToString(),
                    Dimensions = x.Value.Dimensions
                });

            var outputs = session.OutputMetadata
                .Select(x => new
                {
                    Name = x.Key,
                    Type = x.Value.ElementType.ToString(),
                    Dimensions = x.Value.Dimensions
                });

            return Json(new
            {
                success = true,
                inputs = inputs,
                outputs = outputs
            });
        }
    }
}