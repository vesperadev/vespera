import path from 'node:path';

import type { APIAttachment, Snowflake } from '../core';

export class Attachment {
  /**
   * The ID of the attachment
   * @type {Snowflake}
   * @readonly
   */
  public id: Snowflake;

  /**
   * The URL of the attachment
   * @type {string}
   * @readonly
   */
  public url: string;

  /**
   * The name of the attachment
   * @type {string}
   * @readonly
   */
  public name: string;

  /**
   * The size of the attachment
   * @type {number}
   * @readonly
   */
  public size: number;

  /**
   * The proxy URL of the attachment
   * @type {string}
   * @readonly
   */
  public proxyURL: string;

  /**
   * The height of the attachment
   * @type {?number}
   * @readonly
   */
  public height: number | undefined;

  /**
   * The width of the attachment
   * @type {?number}
   * @readonly
   */
  public width: number | undefined;

  /**
   * The content type of the attachment
   * @type {string}
   * @readonly
   */
  public contentType: string;

  /**
   * The description of the attachment
   * @type {string}
   * @readonly
   */
  public description: string;

  /**
   * Whether or not this attachment is ephemeral
   * @type {boolean}
   * @readonly
   */
  public ephemeral: boolean;

  /**
   * The duration of the attachment
   * @type {?number}
   * @readonly
   */
  public duration: number | undefined;

  /**
   * The waveform of the attachment
   * @type {?string}
   * @readonly
   */
  public waveform: string | undefined;

  /**
   * The flags of the attachment
   * @type {?number}
   * @readonly
   */
  public flags: number | undefined;

  constructor(data: APIAttachment) {
    this.id = data.id;
    this.url = data.url;
    this.name = data.filename;
    this.size = data.size;
    this.proxyURL = data.proxy_url;
    this.height = data.height ?? undefined;
    this.width = data.width ?? undefined;
    this.contentType = data.content_type ?? 'application/octet-stream';
    this.description = data.description ?? '';
    this.ephemeral = data.ephemeral ?? false;
    this.duration = data.duration_secs ?? undefined;
    this.waveform = data.waveform ?? undefined;
    this.flags = data.flags ?? undefined;
  }

  /**
   * The function `isSpoiler` checks if the file name or URL starts with 'SPOILER_'.
   * @returns {boolean} The code snippet is checking if the basename of the URL or name starts with 'SPOILER_'.
   * If it does, the function returns true, indicating that the content may be a spoiler. If it doesn't
   * start with 'SPOILER_', the function returns false.
   */
  public isSpoiler() {
    return path.basename(this.url ?? this.name).startsWith('SPOILER_');
  }
}
