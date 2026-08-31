export interface GoogleChatSpace {
  name: string; // e.g. "spaces/AAAAAAAAAAA"
  displayName?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  spaceThreadingState?: string;
  type?: string;
}

export interface GoogleChatMessage {
  name: string; // e.g. "spaces/AAA/messages/BBB"
  text?: string;
  createTime?: string;
  sender?: {
    name?: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
  formattedText?: string;
}

export interface GoogleChatMember {
  name: string;
  state?: string;
  role?: string;
  member?: {
    name?: string;
    displayName?: string;
    type?: string;
  };
}

const CHAT_API_BASE = 'https://chat.googleapis.com/v1';

// List spaces for the authenticated user
export async function listGoogleChatSpaces(accessToken: string): Promise<GoogleChatSpace[]> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/spaces?pageSize=50`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch spaces: ${res.statusText}`);
    }

    const data = await res.json();
    return data.spaces || [];
  } catch (error) {
    console.error('Error fetching Google Chat spaces:', error);
    throw error;
  }
}

// List messages in a space
export async function listGoogleChatMessages(
  accessToken: string,
  spaceName: string
): Promise<GoogleChatMessage[]> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/${spaceName}/messages?pageSize=30`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch messages: ${res.statusText}`);
    }

    const data = await res.json();
    // Messages return latest first or chronological, reverse to show timeline if needed
    return data.messages || [];
  } catch (error) {
    console.error(`Error fetching messages for ${spaceName}:`, error);
    throw error;
  }
}

// Send a message into a space (requires confirmation in UI per workspace guidelines)
export async function sendGoogleChatMessage(
  accessToken: string,
  spaceName: string,
  text: string
): Promise<GoogleChatMessage> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/${spaceName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to send message: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error sending message to ${spaceName}:`, error);
    throw error;
  }
}

// Create a new collaboration space
export async function createGoogleChatSpace(
  accessToken: string,
  displayName: string
): Promise<GoogleChatSpace> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/spaces`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spaceType: 'SPACE',
        displayName,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to create space: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error creating Google Chat space:', error);
    throw error;
  }
}

// List members in a space
export async function listGoogleChatMembers(
  accessToken: string,
  spaceName: string
): Promise<GoogleChatMember[]> {
  try {
    const res = await fetch(`${CHAT_API_BASE}/${spaceName}/members?pageSize=50`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch members: ${res.statusText}`);
    }

    const data = await res.json();
    return data.memberships || [];
  } catch (error) {
    console.error(`Error fetching members for ${spaceName}:`, error);
    throw error;
  }
}
