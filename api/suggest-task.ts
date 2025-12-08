import Anthropic from '@anthropic-ai/sdk';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { dayOfWeek, month, existingTasks } = await req.json();

    const client = new Anthropic({ apiKey });

    const weekdays = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
    const dayName = weekdays[dayOfWeek];

    const existingTasksText = existingTasks?.length > 0
      ? `すでにある「やること」: ${existingTasks.join('、')}`
      : 'まだ「やること」はありません';

    const prompt = `あなたは小学2年生の子どもに「やること」を提案するアシスタントです。

今日は${month}月の${dayName}です。
${existingTasksText}

以下の条件で、子どもに1つだけ「やること」を提案してください：
- ひらがなで書く（小学1年生で習う簡単な漢字は使ってOK）
- 10文字以内で短く
- 子どもが自分でできること
- 楽しそうなこと
- すでにある「やること」と重複しない

提案だけを出力してください（説明不要）。`;

    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{ role: 'user', content: prompt }],
    });

    const suggestion = message.content[0].type === 'text'
      ? message.content[0].text.trim()
      : '';

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
