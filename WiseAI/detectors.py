from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import language_tool_python

# Load AI detection model (OpenAI detector fine-tuned model)
tokenizer = AutoTokenizer.from_pretrained("roberta-base-openai-detector")
model = AutoModelForSequenceClassification.from_pretrained("roberta-base-openai-detector")

# Grammar tool
tool = language_tool_python.LanguageTool('en-US')

def detect_ai_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1)
    ai_prob = probs[0][1].item()
    human_prob = probs[0][0].item()

    if ai_prob > human_prob:
        return f"⚠️ This text is likely written by AI (Confidence: {ai_prob:.2%})"
    else:
        return f"✅ This text is likely written by a human (Confidence: {human_prob:.2%})"

def check_grammar(text):
    matches = tool.check(text)
    issues = []
    for match in matches:
        issues.append(f"{match.message} (suggest: {match.replacements})")
    return issues
