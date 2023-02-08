/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Comments {
  /** ID */
  id?: number;
  /** Post */
  post: number;
  /** Author */
  author: number;
  /** Ref */
  ref?: number | null;
  /**
   * Comm
   * @minLength 1
   * @maxLength 256
   */
  comm: string;
  /**
   * Comm datetime
   * @format date-time
   */
  comm_datetime?: string;
}

export interface Likes {
  /** Id post */
  id_post: number;
  /** Id user */
  id_user: number;
}

export interface PostComment {
  /** ID */
  id?: number;
  /** Post */
  post: number;
  /** Author */
  author: number;
  /** Ref */
  ref?: number | null;
  /**
   * Comm
   * @minLength 1
   * @maxLength 256
   */
  comm: string;
}

export interface Posts {
  /** ID */
  id?: number;
  /** Author */
  author: number;
  /**
   * Title
   * @minLength 1
   * @maxLength 64
   */
  title: string;
  /**
   * Descript
   * @minLength 1
   * @maxLength 1024
   */
  descript: string;
  /** Image */
  image?: string | null;
  /**
   * Post datetime
   * @format date-time
   */
  post_datetime?: string | null;
}

export interface Users {
  /** ID */
  id?: number;
  /**
   * Username
   * @minLength 1
   * @maxLength 16
   */
  username: string;
  /**
   * Pass field
   * @minLength 1
   * @maxLength 32
   */
  pass_field: string;
  /**
   * Descript
   * @maxLength 64
   */
  descript?: string | null;
  /** Image */
  image?: string | null;
  /**
   * Reg datetime
   * @format date-time
   */
  reg_datetime?: string | null;
}
