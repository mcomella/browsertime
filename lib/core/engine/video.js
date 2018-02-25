'use strict';
const get = require('lodash.get');
const startVideoDesktop = require('../../support/video/scripts/startVideo');
const startVideoAndroid = require('../../support/video/scripts/startVideoAndroid');
const stopVideoDesktop = require('../../support/video/scripts/stopVideo');
const stopVideoAndroid = require('../../support/video/scripts/stopVideoAndroid');
const runVisualMetrics = require('../../support/video/scripts/runVisualMetrics');
const removeVideo = require('../../support/video/scripts/removeVideo');
const finetuneVideo = require('../../support/video/scripts/finetuneVideo');

/**
 * Create a new Video that handles everything with the video
 * @class
 */
class Video {
  constructor(options) {
    this.options = options;
    this.testOnAndroid = get(options, 'chrome.android.package', false);
  }

  /**
   * Start recoding a video.
   * @param {object} context - a pre/post task configuration object
   * @returns {Promise} Promise object that represents when the video started
   */
  record(context) {
    return this.testOnAndroid
      ? startVideoAndroid.run(context)
      : startVideoDesktop.run(context);
  }

  /**
   * Stop recording the video.
   * @param {object} context - a pre/post task configuration object
   * @returns {Promise} Promise object that represents when the video stopped
   */
  stop(context) {
    return this.testOnAndroid
      ? stopVideoAndroid.run(context)
      : stopVideoDesktop.run(context);
  }
  /**
   * Get an array of promises that will post process the video.
   * Post process can be run visual metrics, finetune the final video
   * and/or just remove the video.
   * @returns {Array} An array of promises that represents post processing of the video
   */
  postProcessVideo() {
    const postProcess = [];
    if (this.options.speedIndex) {
      postProcess.push(runVisualMetrics);
    }

    if (this.options.video) {
      postProcess.push(finetuneVideo);
    } else {
      postProcess.push(removeVideo);
    }
    return postProcess;
  }
}

module.exports = Video;