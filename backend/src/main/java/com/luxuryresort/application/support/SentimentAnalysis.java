package com.luxuryresort.application.support;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;
import java.util.Set;

public final class SentimentAnalysis {

    private static final Set<String> POSITIVE = Set.of(
            "good", "great", "excellent", "love", "loved", "perfect", "amazing", "wonderful", "nice", "best",
            "чудово", "добре", "клас", "супер", "подобається", "рекомендую"
    );

    private static final Set<String> NEGATIVE = Set.of(
            "bad", "terrible", "awful", "hate", "worst", "poor", "dirty", "noisy", "rude",
            "жах", "погано", "брудно", "шумно", "не рекомендую"
    );

    private SentimentAnalysis() {
    }

    public static BigDecimal score(String text) {
        if (text == null || text.isBlank()) {
            return BigDecimal.ZERO.setScale(4, RoundingMode.HALF_UP);
        }
        String[] tokens = text.toLowerCase(Locale.ROOT).split("\\W+");
        int pos = 0;
        int neg = 0;
        for (String t : tokens) {
            if (t.isEmpty()) {
                continue;
            }
            if (POSITIVE.contains(t)) {
                pos++;
            } else if (NEGATIVE.contains(t)) {
                neg++;
            }
        }
        int denom = pos + neg;
        if (denom == 0) {
            return BigDecimal.ZERO.setScale(4, RoundingMode.HALF_UP);
        }
        double raw = (pos - neg) / (double) denom;
        return BigDecimal.valueOf(Math.min(1.0, Math.max(-1.0, raw))).setScale(4, RoundingMode.HALF_UP);
    }
}
