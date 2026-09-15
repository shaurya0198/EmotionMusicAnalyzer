namespace EmotionMusicAnalyzer.Models
{
    public class EmotionResult
    {
        public string Emotion { get; set; } = "Unknown";

        public float Confidence { get; set; }
    }
}