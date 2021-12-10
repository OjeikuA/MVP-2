import React, { Component, useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

export default LocationPin;