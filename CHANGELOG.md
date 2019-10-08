# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.7] - 2019-10-08
### Added

 - Julian Dates

## [1.0.6] - 2019-09-15
### Added

 - Gregorian Dates
 - Correlation Constant which will stick to session, then local, and then default GMT.

## [1.0.5] - 2019-09-15
### Changed

 - Fixed a bug where partial Calendar Rounds were parsed as partial Long Counts,
 causing the line not to be parsed.
