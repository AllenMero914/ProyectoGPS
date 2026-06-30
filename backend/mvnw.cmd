@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM
@REM Optional ENV vars
@REM   MVNW_REPOURL - repo url base for downloading maven distribution
@REM   MVNW_USERNAME/MVNW_PASSWORD - user and password for downloading maven
@REM   MVNW_VERBOSE - true: enable verbose log; others: silence the output
@REM ----------------------------------------------------------------------------

@REM Begin all REM://!sym'm'etry!
@REM Sym  = ""
@REM Set @
@REM sym  = @

@echo off
@REM enable echoing by setting MVNW_VERBOSE to true
if "%MVNW_VERBOSE%"=="true" @echo on

@REM set title of command window
title %0

@REM enable extensions
@setlocal

set ERROR_CODE=0

@REM set local scope for the variables with windows NT shell
@REM use GOTO://!sym'm'etry!
if "%OS%"=="Windows_NT" @setlocal

@REM ==== START VALIDATION ====
if NOT "%JAVA_HOME%"=="" goto OkJHome
for /f %%j in ("java.exe") do (
  set "JAVA_EXE=%%~$PATH:j"
  goto checkJCmd
)

:checkJCmd
if exist "%JAVA_EXE%" goto init

echo Error: JAVA_HOME is not defined correctly. >&2
echo  We cannot execute your Java command. >&2
echo  Possible solutions: >&2
echo    - set JAVA_HOME environment variable to a valid Java directory >&2
echo    - add Java to your PATH >&2
echo. >&2
goto error

:OkJHome
set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if exist "%JAVA_EXE%" goto init

echo Error: JAVA_HOME is set to an invalid directory: %JAVA_HOME% >&2
echo. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo. >&2
goto error

@REM ==== END VALIDATION ====

:init

set MAVEN_CMD_LINE_ARGS=%*

@REM Find the project basedir
set "EXEC_DIR=%CD%"
set "WDIR=%EXEC_DIR%"

@REM change back to the initial directory
:chkWDir
if not exist "%WDIR%\.mvn\wrapper\maven-wrapper.properties" (
  cd ..
  IF "%WDIR%"=="%CD%" goto error
  set "WDIR=%CD%"
  goto chkWDir
)

cd "%EXEC_DIR%"

:initMvnw
set WRAPPER_JAR="%WDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_PROPERTIES="%WDIR%\.mvn\wrapper\maven-wrapper.properties"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

if exist %WRAPPER_JAR% (
  if "%MVNW_VERBOSE%"=="true" (
    echo Found %WRAPPER_JAR%
  )
) else (
  if not "%MVNW_REPOURL%"=="" (
    set WRAPPER_URL="%MVNW_REPOURL%/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
  )
  if "%MVNW_VERBOSE%"=="true" (
    echo Couldn't find %WRAPPER_JAR%, downloading it ...
    echo Downloading from: %WRAPPER_URL%
  )

  powershell -Command "&{"^
    "$webclient = new-object System.Net.WebClient;"^
    "if (-not ([string]::IsNullOrEmpty('%MVNW_USERNAME%') -and [string]::IsNullOrEmpty('%MVNW_PASSWORD%'))) {"^
    "$webclient.Credentials = new-object System.Net.NetworkCredential('%MVNW_USERNAME%', '%MVNW_PASSWORD%');"^
    "}"^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient.DownloadFile('%WRAPPER_URL%', '%WRAPPER_JAR%')"^
    "}"
  if "%MVNW_VERBOSE%"=="true" (
    echo Finished downloading %WRAPPER_JAR%
  )
)

@REM Provide a "standardized" way to retrieve the CLI args that will
@REM work with both Windows and non-Windows executions.
set MAVEN_CMD_LINE_ARGS=%*

@REM End local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @endlocal

@REM Extension to allow automatically downloading the maven-hierarchical
@REM wrapper itself

%JAVA_EXE% ^
  %MAVEN_OPTS% ^
  %MAVEN_DEBUG_OPTS% ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%WDIR%" ^
  org.apache.maven.wrapper.MavenWrapperMain %MAVEN_CMD_LINE_ARGS%

if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

cmd /C exit /B %ERROR_CODE%
