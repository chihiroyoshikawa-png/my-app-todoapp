import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

// 季節のイベントや特徴を取得
function getSeasonalContext(month: number, day: number): string {
  // 特別な日のチェック
  const specialDays: { [key: string]: string } = {
    '1-1': 'お正月',
    '2-3': '節分',
    '2-14': 'バレンタインデー',
    '3-3': 'ひなまつり',
    '3-14': 'ホワイトデー',
    '4-1': '新学期',
    '5-5': 'こどもの日',
    '6-21': '夏至',
    '7-7': '七夕',
    '8-15': 'お盆',
    '9-23': '秋分の日',
    '10-31': 'ハロウィン',
    '11-23': '勤労感謝の日',
    '12-22': '冬至',
    '12-24': 'クリスマスイブ',
    '12-25': 'クリスマス',
    '12-31': '大晦日',
  };

  const key = `${month}-${day}`;
  if (specialDays[key]) {
    return `今日は「${specialDays[key]}」です。`;
  }

  // 季節の特徴
  if (month >= 3 && month <= 5) {
    return '春です。あたたかくなってきて、お花がさく季節です。';
  } else if (month >= 6 && month <= 8) {
    return '夏です。あつい日が続く季節です。プールや虫とりが楽しい時期です。';
  } else if (month >= 9 && month <= 11) {
    return '秋です。すずしくなってきて、紅葉がきれいな季節です。';
  } else {
    return '冬です。さむい日が続きます。あたたかくしてすごしましょう。';
  }
}

// 曜日に応じたヒント
function getDayOfWeekContext(dayOfWeek: number): string {
  const contexts = [
    'お休みの日なので、ふだんできないことにちょうせんできます。', // 日曜
    '一週間のはじまりです。元気にスタートしましょう。', // 月曜
    '火曜日です。がんばる日です。', // 火曜
    '週の真ん中です。あと少しで週末ですね。', // 水曜
    '木曜日です。もうすぐ週末です。', // 木曜
    '金曜日です。あしたはお休み！今日をのりこえよう。', // 金曜
    'お休みの日なので、楽しいことにちょうせんできます。', // 土曜
  ];
  return contexts[dayOfWeek];
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { dayOfWeek, month, day, existingTasks } = await req.json();

    const client = new OpenAI({ apiKey });

    const weekdays = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
    const dayName = weekdays[dayOfWeek];

    const seasonalContext = getSeasonalContext(month, day);
    const dayOfWeekContext = getDayOfWeekContext(dayOfWeek);

    const existingTasksText = existingTasks?.length > 0
      ? `すでにある「やること」: ${existingTasks.join('、')}`
      : 'まだ「やること」はありません';

    const prompt = `あなたは小学2年生の子どもに「今日のちょうせん」を提案するアシスタントです。

【今日の情報】
- ${month}月${day}日（${dayName}）
- ${seasonalContext}
- ${dayOfWeekContext}
- ${existingTasksText}

【ちょうせんのルール】
今日という日に合った、ちょっとがんばればできる「ちょうせん」を1つ提案してください。

- ひらがなで書く（小学1年生で習う簡単な漢字は使ってOK）
- 15文字以内で短く
- 今日の季節・曜日・イベントに関係すること
- ふだんやらないこと、新しいことへのちょうせん
- すでにある「やること」と重複しない

【出力】
提案だけを出力してください（説明不要）。`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }],
    });

    const suggestion = completion.choices[0]?.message?.content?.trim() || '';

    return new Response(JSON.stringify({ suggestion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestion' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
